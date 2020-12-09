import api from "../../lib/api";
import { LocalStorage } from "quasar";
import { axios } from "src/boot/axios";

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
    console.error("FAILED TO AUTHENTICATE");
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
    console.error("FAILED TO SET HOME FEED");
    return commit("SET_ERROR", String(err));
  }
}
export async function SET_ANIME({ commit, dispatch }, id) {
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
    season.title = "S" + season.season_number + " - " + season.title;
    promise_arr.push(api(new_options));
  }
  await Promise.all(promise_arr).then(async teste => {
    teste.map((res, index) => {
      anime.seasons[index].episodes = res.data.items.filter(
        key => key.episode_number != null
      );
    });
  });
  commit("SET_ANIME", anime);
  return;
}
export async function SET_SIMILAR({ commit }, id) {
  let options = {
    endpoint: "/content/v1/similar_to",
    method: "get",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: LocalStorage.getItem("auth").token.access_token
    },
    params: {
      n: 10,
      guid: id
    }
  };
  let { items } = (await api(options)).data;
  commit("SET_SIMILAR", items);
}
export async function SET_EPISODE({ commit }, id) {
  let options = {
    endpoint: `/cms/v2${
      LocalStorage.getItem("auth").psk.bucket
    }/episodes/${id}`,
    method: "get",
    cors: true
  };
  try {
    var next_episode,
      episode = (await api(options)).data;

    if (episode.is_premium_only) {
      console.log("Getting premium");
      let [streams] = await Promise.all([
        (await axios.get("http://localhost:3000/premium/" + id)).data
      ]);
      var blob = new Blob([streams], {
        type: "text/plain; charset=utf-8"
      });
      let video_stream_url = URL.createObjectURL(blob) + "#.m3u8";
      next_episode = null;
      episode.stream = video_stream_url;
    } else {
      let [streams, next_ep] = await Promise.all([
        (await api({ ...options, endpoint: episode.__links__.streams.href }))
          .data,
        (
          await api({
            ...options,
            endpoint: episode.__links__["episode/next_episode"].href
          })
        ).data
      ]);
      next_episode = next_ep;
      episode.streams = streams;
    }
    commit("SET_EPISODE", episode);
    commit("SET_NEXT_EPISODE", next_episode);
    return true;
  } catch (err) {
    console.error("FAILED TO CATCH EPISODE");
    console.error(err);
  }
  return false;
}
export async function SET_NEXT_EPISODE({ commit }, id) {
  let options = {
    endpoint: `/cms/v2${
      LocalStorage.getItem("auth").psk.bucket
    }/episodes/${id}`,
    method: "get",
    cors: true
  };
  try {
    let { data } = await api(options);
    let next_episode = data;

    options.endpoint = next_episode.__links__.streams.href;
    data = await api(options);
    next_episode.streams = data.data;
    commit("SET_NEXT_EPISODE", next_episode);
    return true;
  } catch (err) {
    console.error("FAILED TO CATCH EPISODE");
  }
  return false;
}

export async function SET_SEARCH({ commit }, search_text) {
  let options = {
    endpoint: `/content/v1/search`,
    method: "get",
    params: { q: search_text },
    headers: {
      Authorization: LocalStorage.getItem("auth").token.access_token
    }
  };
  let { data } = await api(options);
  if (data) {
    return commit("SET_SEARCH", data.items[1].items);
  }
  return console.error("SEARCH ACTION");
}
