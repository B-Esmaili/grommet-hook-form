import useAxios from "axios-hooks";
import MockAdapter from "axios-mock-adapter";
import { useCallback, useEffect, useState } from "react";
import StaticAxios from "axios";

import {
  DataFecthStatus,
  DataFetchInfo,
  PageDataProps,
  PageDataResult,
} from "./types";

const usePagedData = <
  TListItem = any,
  TData = TListItem[],
  TServerData = TData,
  TError = any
>(
  props: PageDataProps<TData, TServerData, TError>
): PageDataResult<TData, TError> => {
  let {
    request,
    lazy,
    params,
    onResponse,
    onRequest,
    mockResponse,
    listPropName = "list",
    totalPropName = "total",
    searchParam,
    searchParamName = "searchKey",
    page: _page,
    pageSize = 20,
    pageParamName = "page",
    pageSizeParamName = "pageSize",
  } = props;

  if (lazy === undefined || lazy === null) {
    lazy = false;
  }

  if (typeof request === "string") {
    request = {
      url: request,
    };
  }

  let [page, setPage] = useState<number>(0);
  let [total, setTotal] = useState<number>(0);
  let [hasMore, setHasMore] = useState<boolean>(false);

  let [currentFetch, setCurrentFetch] = useState<DataFetchInfo<
    TServerData,
    TError
  > | null>(null);

  const getParams = (): object => {
    let _params: Record<string, any> = {
      [pageSizeParamName ?? "pageSize"]: pageSize,
    };

    if (searchParam) {
      _params[searchParamName ?? "searchKey"] = searchParam;
    }

    return _params;
  };

  // let loading  = false,error = "", refetch = ()=>{};

  const [{ loading, error }, refetch] = useAxios(
    {
      ...request
      ,
      transformRequest: useCallback(
        (data: any, headers: any) => {
          return onRequest ? onRequest(data, headers) : data;
        },
        [onRequest]
      ),
      transformResponse: useCallback(
        function (data: TServerData, headers: any) {
          data = JSON.parse(data as any);
          setCurrentFetch((f: DataFetchInfo<TServerData, TError> | null) => ({
            page: f!?.page,
            data,
            status: DataFecthStatus.Done,
            headers,
          }));

          return (data as unknown) as TData;
        },
        [onResponse]
      ),
    },
    { manual: true }
  );

  const handleServerData = (
    data: TServerData,
    page: number,
    headers: any
  ): boolean => {
    let result: TData;
    let list: any[];

    if (onResponse) {
      result = onResponse(data, page, headers);
    } else {
      result = (data as unknown) as TData;
    }

    if (!result) {
      return true;
    }

    if (!Array.isArray(result)) {
      list = (result as any)[listPropName];
    } else {
      list = (result as unknown) as any[];
    }

    if (!list) {
      return false;
    }

    let totalRecords = (result as any)[totalPropName];
    setTotal(totalRecords);
    setHasMore(list.length === pageSize);

    setData(result);
    return true;
  };

  const nextPage = () => {
    loadPage(page + 1);
  };

  const [data, setData] = useState<TData | null>(null);

  const reset = () => {
    loadPage(1);
  };

  useEffect(() => {
    if (!page && lazy) {
      return;
    }
    if (!_page) {
      _page = 1;
    }

    loadPage(_page);
  }, [_page]);

  const loadPage = (pNum: number) => {
    setCurrentFetch({
      page: pNum,
      status: DataFecthStatus.Pending,
    });
  };

  useEffect(() => {
    if (currentFetch) {
      if (currentFetch.status === DataFecthStatus.Pending) {
        if (loading) {
          return;
        }
        refetch({
          params: {
            ...getParams(),
            [pageParamName]: currentFetch.page,
          },
        });
      }

      if (currentFetch.status === DataFecthStatus.Done) {
        if (
          handleServerData(
            currentFetch.data!,
            currentFetch.page,
            currentFetch.headers
          )
        ) {
          setPage(currentFetch.page);
        }
      }
    }
  }, [currentFetch]);

  useEffect(() => {
    reset();
  }, [
    request,
    pageSize,
    params,
    searchParam,
    searchParamName,
    pageParamName,
    pageSizeParamName,
  ]);

  if (mockResponse) {
    let mock = new MockAdapter(StaticAxios);
    mockResponse(mock);
  }

  return { data, loading, error, page, total, hasMore, nextPage, reset };
};

export { usePagedData };
