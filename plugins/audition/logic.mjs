const SKIP_THRESHOLD_MIN_MS = 5000;
const SKIP_THRESHOLD_MAX_MS = 90000;

export function isRepeat({ current_state, previous_state }) {
  return current_state.item_uri === previous_state.item_uri && 
    current_state.progress_ms < previous_state.progress_ms;
}

export function isSkip({ current_state, previous_state }) {
  return current_state.item_uri !== previous_state.item_uri && 
    curent_state.context_uri === previous_state.context_uri &&
    previous_state.progress_ms > SKIP_THRESHOLD_MIN_MS &&
    previous_state.progress_ms < SKIP_THRESHOLD_MAX_MS;
}
