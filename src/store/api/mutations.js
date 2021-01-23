export function SET_ERROR(state, err) {
  state.error.push(err);
}
export function SET_AUTH(state, data) {
  state.auth = data;
}
export function SET_HOME_FEED(state, data) {
  state.home_feed = data;
}
export function SET_ANIME(state, data) {
  state.anime = { ...state.anime, ...data };
}
export function SET_SIMILAR(state, data) {
  state.similar = data;
}
export function SET_EPISODE(state, data) {
  state.episode = data;
}
export function SET_NEXT_EPISODE(state, data) {
  state.next_episode = data;
}
export function SET_SEARCH(state, data) {
  state.search_result = data;
}
