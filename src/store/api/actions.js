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
    return commit("SET_AUTH", auth);
  } catch (error) {
    return commit("SET_ERROR", "Falha de rede");
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
    return Promise.all(promise_arr).then(teste => {
      teste.map((res, index) => {
        data.items[index].animes = res.data.items;
      });
      return commit("SET_HOME_FEED", data.items);
    });
  } catch (err) {
    return commit("SET_ERROR", String(err));
  }
}
export async function SET_ANIME({ commit }, id) {
  let options = {
    endpoint: `/cms/v2${LocalStorage.getItem("auth").psk.bucket}/series/${id}`,
    method: "get",
    cors: true
  };
  let response = await api(options);
  var anime = response.data;
  options.endpoint = anime.__links__["series/seasons"].href;
  response = await api(options);
  anime.seasons = response.data.items;
  let promise_arr = [];
  for (let season of anime.seasons) {
    let new_options = {
      ...options,
      endpoint: season.__links__["season/episodes"].href
    };
    promise_arr.push(api(new_options));
  }
  return Promise.all(promise_arr).then(teste => {
    teste.map((res, index) => {
      anime.seasons[index].episodes = res.data.items;
    });
    return commit("SET_ANIME", anime);
  });
}
export async function SET_EPISODE({ commit }, id) {
  let options = {
    endpoint: `/cms/v2${
      LocalStorage.getItem("auth").psk.bucket
    }/episodes/${id}`,
    method: "get",
    cors: true
  };
  let { data } = await api(options);
  let episode = data;
  options.endpoint = episode.__links__.streams.href;
  data = await api(options);
  episode.streams = data.data;
  commit("SET_EPISODE", episode);
}
