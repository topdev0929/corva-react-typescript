/* eslint-disable camelcase */

declare module '*.css';
declare module '*.svg';

declare module '@corva/ui/clients' {
  export type QueryParams = {
    limit: number;
    skip: number;
    sort: string;
    query: string;
    fields?: string;
  };

  export type CollectionRecord<T> = {
    _id: string;
    version: number;
    app_key: string;
    asset_id: number;
    company_id: number;
    provider: string;
    collection: string;
    timestamp: number;
    data: T;
  };

  function get<T>(url: string, params: QueryParams): Promise<CollectionRecord<T>[]>;

  function post<T>(
    url: string,
    content: Omit<CollectionRecord<T>, '_id'>[]
  ): Promise<{
    failed_count: number;
    inserted_ids: string[];
    messages: string[];
  }>;

  function put<T>(url: string, content: T, params: QueryParams): Promise<T>;

  function del(
    url: string,
    params: QueryParams
  ): Promise<{
    deleted_count: 0;
  }>;

  export const corvaDataAPI = {
    get,
    post,
    put,
    del,
  };
}

declare module '@corva/ui/clients/jsonApi' {
  export function getS3SignedUrl(
    filename: string,
    contentType: string,
    assetId?: number | null
  ): Promise<{
    bucket: string;
    display_name: string;
    file_name: string;
    signed_url: string;
  }>;

  export function getS3DownloadLink(filename: string): Promise<{
    url: string;
  }>;

  export type TaskOptions<Properties, Payload> = {
    provider: string;
    app_key: string;
    asset_id: number;
    properties: Properties;
    payload: Payload;
  };

  export enum TaskState {
    Running = 'running',
    Succeeded = 'succeeded',
    Failed = 'failed'
  }

  export type TaskResponse = {
    id: string;
    name: string;
    options: Record<string, unknown>;
    type: 'task';
    attributes: {
      id: string;
      state: TaskState
      fail_reason: null;
      asset_id: number;
      company_id: number;
      app_id: number;
      document_bucket: string;
      properties: Record<string, unknown>;
      payload: Record<string, unknown>;
    };
  };

  export function postTask<P>(options: TaskOptions<P>): Promise<TaskResponse>;
}

declare module '@corva/ui/utils' {
  export function convertValue(
    value: number,
    unitType: string,
    unitFrom: string,
    unitTo?: string,
    precision?: number
  ): number;

  function convertJsonToCsv<T>(records: T[], mapping: Partial<Record<keyof T, string>>): string;
  function downloadFile(filename: string, csv: string): void;

  export const csvExport = {
    convertJsonToCsv,
    downloadFile,
  };
}

declare module '@corva/ui/components' {
  import { FC } from 'react';
  import { TabProps, TabsProps } from '@material-ui/core';

  // corva components
  type LoadingIndicatorProps = {
    fullscreen?: boolean;
    white?: boolean;
    size?: number;
    className?: string;
  };
  export const LoadingIndicator: FC<LoadingIndicatorProps>;

  export const AppHeader: FC<any>;

  // MUI Components
  export const Tabs: FC<TabsProps>;
  export const Tab: FC<TabProps>;
}
