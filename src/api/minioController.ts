// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** 此处后端没有提供注释 DELETE /minio/delete */
export async function deleteFile(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFileParams,
  options?: { [key: string]: any }
) {
  return request<string>('/minio/delete', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 DELETE /minio/delete/batch */
export async function deleteFiles(body: string[], options?: { [key: string]: any }) {
  return request<string>('/minio/delete/batch', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /minio/upload */
export async function upload(body: {}, options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/minio/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /minio/upload/batch */
export async function uploadBatch(body: {}, options?: { [key: string]: any }) {
  return request<API.BaseResponseListString>('/minio/upload/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
