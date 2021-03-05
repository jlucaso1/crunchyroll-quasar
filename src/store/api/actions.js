import api from "../../lib/api";

export async function CLEAR_ALL({ commit, dispatch }) {
  commit("SET_AUTH", null);
  commit("SET_HOME_FEED", null);
  commit("SET_EPISODE", null);
  commit("SET_ANIME", null);
  commit("SET_NEXT_EPISODE", null);
  commit("SET_SIMILAR", null);
  commit("SET_SEARCH", null);
  return await dispatch("SET_AUTH");
}

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
    return commit("SET_AUTH", auth);
  } catch (error) {
    console.error("FAILED TO AUTHENTICATE");
    return commit("SET_ERROR", "Falha de rede");
  }
}
export async function SET_HOME_FEED({ commit, state }) {
  let options = {
    endpoint: "/content/v1/home_feed",
    method: "get",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: state.auth.token.access_token
    }
  };
  try {
    var { data } = await api(options);
    data.items = data.items.filter((item, index) => {
      return ["curated_collection", "dynamic_collection"].includes(
        item.resource_type
      );
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
export async function SET_ANIME({ commit, dispatch, state }, id) {
  let options = {
    endpoint: `/cms/v2${state.auth.psk.bucket}/series/${id}`,
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
export async function SET_SIMILAR({ commit, state }, id) {
  let options = {
    endpoint: "/content/v1/similar_to",
    method: "get",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: state.auth.token.access_token
    },
    params: {
      n: 10,
      guid: id
    }
  };
  let { items } = (await api(options)).data;
  commit("SET_SIMILAR", items);
}
export async function SET_EPISODE({ commit, state, dispatch }, id) {
  let options = {
    endpoint: `/cms/v2${state.auth.psk.bucket}/episodes/${id}`,
    method: "get",
    cors: true
  };
  if (id == state.next_episode?.id) {
    let episode = state.next_episode;
    dispatch("SET_NEXT_EPISODE", episode.next_episode_id);
    commit("SET_EPISODE", episode);
    return;
  }

  try {
    let episode = (await api(options)).data;
    if (!episode.is_premium_only) {
      let streams = (
        await api({ ...options, endpoint: episode.__links__.streams.href })
      ).data;
      episode.streams = streams;
      episode.title_formatted =
        "S" +
        episode.season_number +
        "-E" +
        episode.episode_number +
        ": " +
        episode.title;
      dispatch("SET_NEXT_EPISODE", episode.next_episode_id);
      commit("SET_EPISODE", episode);
      return true;
    } else {
      console.error("THIS EPISODE IS PREMIUM ONLY");
    }
  } catch (err) {
    console.error("FAILED TO CATCH EPISODE");
    console.error(err);
  }
  return false;
}
export async function SET_NEXT_EPISODE({ commit, state }, id) {
  let options = {
    endpoint: `/cms/v2${state.auth.psk.bucket}/episodes/${id}`,
    method: "get",
    cors: true
  };
  try {
    let { data } = await api(options);
    let next_episode = data;

    options.endpoint = next_episode.__links__.streams.href;
    data = await api(options);
    next_episode.streams = data.data;
    next_episode.title_formatted =
      "S" +
      next_episode.season_number +
      "-E" +
      next_episode.episode_number +
      ": " +
      next_episode.title;
    commit("SET_NEXT_EPISODE", next_episode);
    return true;
  } catch (err) {
    console.error("FAILED TO CATCH EPISODE");
  }
  return false;
}

export async function SET_SEARCH({ commit, state }, search_text) {
  let options = {
    endpoint: `/content/v1/search`,
    method: "get",
    params: { q: search_text },
    headers: {
      Authorization: state.auth.token.access_token
    }
  };
  let { data } = await api(options);
  if (data) {
    return commit("SET_SEARCH", data.items[1].items);
  }
  return console.error("SEARCH ACTION");
}
