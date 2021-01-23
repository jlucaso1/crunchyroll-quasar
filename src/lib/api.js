import { axios } from "boot/axios";
import { LocalStorage } from "quasar";

export function LOCALE() {
  let lang = LocalStorage.getItem("locale");
  lang = lang.split("-");
  lang[1] = lang[1].toUpperCase();
  lang = lang.join("-");
  return lang;
}

export default function api(opts) {
  const config = {
    method: opts.method || "get",
    url:
      `${opts.cors ? process.env.CORS : "https://beta-api.crunchyroll.com"}` +
      opts.endpoint,
    params: {
      locale: LOCALE(),
      ...opts.params
    },
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
