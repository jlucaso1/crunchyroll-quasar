export function SET_ERROR(state, err) {
  state.error.push(err);
}
export function SET_AUTH(state, data) {
  state.auth = data;
}
export function SET_HOME_FEED(state, data) {
  state.home_feed = data;
}
