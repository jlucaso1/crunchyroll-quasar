import api from "../../lib/api";
import { LocalStorage } from "quasar";

export async function SET_AUTH({ commit }) {
  let options = {
    endpoint: "/auth/v1/token",
    data: "grant_type=client_id",
    method: "post",
    cors: "true",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic cnFpM2drNHhiMXphenZpdHF3aHI6S0RTZV96cy15R2JQYUlocDhBcEpycFR6MndMSXBXd2s="
    }
  };
  try {
    var auth = {};
    let response = await api(options);
    auth.token = response.data;
    auth.token.expires_in = Date.now() + auth.token.expires_in * 1000;
    auth.token.access_token = "Bearer " + auth.token.access_token;
    // PSK
    options = {
      endpoint: "/index/v2",
      method: "get",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: auth.token.access_token
      }
    };
    response = await api(options);
    auth.psk = response.data.cms;
    LocalStorage.set("auth", auth);
    commit("SET_AUTH", auth);
  } catch (error) {
    commit("SET_ERROR", "Falha de rede");
  }
}
export async function SET_HOME_FEED({ commit }) {
  let options = {
    endpoint: "/content/v1/home_feed",
    method: "get",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: LocalStorage.getItem("auth").token.access_token
    }
  };
  try {
    var { data } = await api(options);
    data.items = data.items.filter((item, index) => {
      return item.resource_type != "panel";
    });
    let promise_arr = [];
    for (let feed_item of data.items) {
      let new_options = {
        ...options,
        endpoint: feed_item.__links__.resource.href
      };
      promise_arr.push(api(new_options));
      feed_item.animes = data;
    }
    Promise.all(promise_arr).then(teste => {
      teste.map((res, index) => {
        data.items[index].animes = res.data.items;
      });
      commit("SET_HOME_FEED", data.items);
    });
  } catch (err) {
    commit("SET_ERROR", String(err));
  }
}
export async function SET_ANIME({ commit }, id) {
  let options = {
    endpoint: `/cms/v2${LocalStorage.getItem("auth").psk.bucket}/series/${id}`,
    method: "get"
  };
  let response = await api(options);
  var anime = response.data;
  commit("SET_ANIME", anime);
}
