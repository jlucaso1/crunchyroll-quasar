import { axios } from "boot/axios";


export const LOCALE = "pt-BR";
export const VERSION = "1.1.20.0";
export const CONNECTIVITY_TYPE = "ethernet";

export default function api(opts) {
  const config = {
    method: opts.method || "get",
    url: `https://beta-api.crunchyroll.com/${opts.endpoint}`,
    params: {
      locale: LOCALE,
      ...opts.params
    },
    data: opts.data,
    headers: opts.headers
  };
  return axios(config);
  
}
export function set_auth({}) {}