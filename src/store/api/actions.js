import api from "../../lib/api";
import { LocalStorage } from "quasar";

export async function SET_TOKEN({ commit }) {
  let options = {
    endpoint: "/auth/v1/token",
    data: "grant_type=client_id",
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic cnFpM2drNHhiMXphenZpdHF3aHI6S0RTZV96cy15R2JQYUlocDhBcEpycFR6MndMSXBXd2s="
    }
  };
  try {
    let { data } = await api(options);
    commit("SET_TOKEN", data);
  } catch (err) {
    commit("SET_ERROR", "Falha ao gerar um token");
  }
}
export async function SET_PSK({ commit }, auth) {
  let options = {
    endpoint: "/index/v2",
    method: "get",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: auth
    }
  };
  try {
    let { data } = await api(options);
    commit("SET_PSK", data.cms);
  } catch (err) {
    commit("SET_ERROR", "Token inválido. Verifique sua conexão com a internet");
  }
}
export async function SET_HOME_FEED({ commit }, auth) {
  let options = {
    endpoint: "/content/v1/home_feed",
    method: "get",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: auth
    },
    params: {
      Policy: LocalStorage.getItem("auth").psk.policy,
      Signature: LocalStorage.getItem("auth").psk.signature,
      "Key-Pair-Id": LocalStorage.getItem("auth").psk.key_pair_id
    }
  };
  try {
    let { data } = await api(options);
    data.items = data.items.filter((item, index) => {
      return item.resource_type != "panel" && index < 8;
    });
    let promise_arr = []
    for (let feed_item of data.items) {
      let new_options = {
        ...options,
        endpoint: feed_item.__links__.resource.href
      };
      let { data } = await api(new_options);
      feed_item.animes = data;
    }

    commit("SET_HOME_FEED", data.items);
  } catch (err) {
    commit("SET_ERROR", String(err));
  }
}
