import { axios } from "boot/axios";
import { LocalStorage } from "quasar";

export const LOCALE = "pt-BR";
export const VERSION = "1.1.20.0";
export const CONNECTIVITY_TYPE = "ethernet";

export default function api(opts) {
  const config = {
    method: opts.method || "get",
    url: `${
      opts.cors ? "https://crunchyroll-quasar.herokuapp.com/" : ""
    }https://beta-api.crunchyroll.com${opts.endpoint}`,
    params: {
      locale: LOCALE,
      ...opts.params
    },
    mode: 'no-cors',
    data: opts.data,
    headers: opts.endpoint.match("cms") ? "" : opts.headers
  };
  if (opts.endpoint.match("cms")) {
    config.params["Policy"] = LocalStorage.getItem("auth").psk.policy;
    config.params["Signature"] = LocalStorage.getItem("auth").psk.signature;
    config.params["Key-Pair-Id"] = LocalStorage.getItem("auth").psk.key_pair_id;
  }
  return axios(config);
}
export function set_auth({}) {}
