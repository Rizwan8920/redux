import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const POST_URL = "https://jsonplaceholder.typicode.com/posts";
const PAGE_SIZE = 30;

export const fetchNextPage = createAsyncThunk(
  "feed/fetchNextPage",
  async (arg, { getState, signal, rejectWithValue }) => {
    const refresh = arg?.refresh;
    const page = refresh ? 1 : getState().feed.page + 1;

    try {
      const response = await fetch(
        `${POST_URL}?_page=${page}&_limit=${PAGE_SIZE}`,
        { signal },
      );
      if (!response.ok) {
        return rejectWithValue(
          `Failed to load page ${page} (status ${response.status})`,
        );
      }

      const items = await response.json();

      const total = Number(response.headers.get("x-total-count"));
      const hasMore = total
        ? page * PAGE_SIZE < total
        : items.length === PAGE_SIZE;

      return { items, page, hasMore };
    } catch (err) {
        if(err.name === "AbortError") throw err;
        return rejectWithValue(err.message);
    }
  },
  {
    condition: (arg, {getState}) => {
        if(arg?.refresh) return true;
        const {status, hasMore} = getState().feed;
        if(status === "loading" || !hasMore) return false;
    }
  }
);

const initialState = {
    items: [],
    page: 0,
    hasMore: true,
    status: "idle",
    error: null,
    currentRequestId: null,
};

const feedSlice = createSlice({
    name: "feed",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNextPage.pending, (state, action) => {
                state.status = "loading";
                state.error = null;
                state.currentRequestId = action.meta.requestId;
                if(action.meta.arg?.refresh){
                    state.items = [];
                    state.page = 0;
                    state.hasMore = true;
                }
            })
            .addCase(fetchNextPage.fulfilled, (state, action) => {
                if(action.meta.requestId !== state.currentRequestId) return;

                const {items, page, hasMore} = action.payload;

                const seen = new Set(state.items.map((p) => p.id));
                for(const item of items){
                    if(!seen.has(item.id)) state.items.push(item);
                }

                state.page = page;
                state.hasMore = hasMore;
                state.status = "idle";
            })
            .addCase(fetchNextPage.rejected, (state, action) => {
                if(action.meta.requestId !== state.currentRequestId) return;

                if(action.meta.aborted){
                    state.status = "idle";
                    return;
                }

                state.status = "failed";
                state.error = action.payload ?? action.error?.message ?? "Could not load posts";
            })
    }
})

export default feedSlice.reducer;

export const selectFeedItems = (state) => state.feed.items;
export const selectFeedStatus = (state) => state.feed.status;
export const selectFeedError = (state) => state.feed.error;
export const selectHasMore = (state) => state.feed.hasMore;
