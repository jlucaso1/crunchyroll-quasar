import { axios } from "boot/axios";
import { LocalStorage } from "quasar";
import { store } from "../store/index";

export default async function api(opts) {
  const config = {
    method: opts.method || "get",
    url:
      `${
        opts.cors
          ? process.env.CORS + "/cors"
          : "https://beta-api.crunchyroll.com"
      }` + opts.endpoint,
    params: {
      locale: LocalStorage.getItem("locale"),
      ...opts.params
    },
    data: opts.data,
    headers: opts.endpoint.match("cms") ? "" : opts.headers
  };

  if (opts.endpoint.match("cms")) {
    config.params["Policy"] = store.state.api.auth.psk.policy;
    config.params["Signature"] = store.state.api.auth.psk.signature;
    config.params["Key-Pair-Id"] = store.state.api.auth.psk.key_pair_id;
  }
  return axios(config);
}
export function set_auth({}) {}
