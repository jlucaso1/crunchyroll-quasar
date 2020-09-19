export function SET_ERROR(state, err) {
  state.error.push(err);
}
export function SET_TOKEN(state, data) {
  state.token = data;
}
export function SET_PSK(state, data) {
  state.psk = data;
}
export function SET_HOME_FEED(state, data) {
  state.home_feed = data;
}
