import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectFeedError, selectFeedItems, selectFeedStatus, selectHasMore, fetchNextPage } from '../features/feedSlice';
import useLoadMoreOnScroll from '../hooks/useLoadMoreOnScroll';

function Feed() {

    const dispatch = useDispatch();
    const items = useSelector(selectFeedItems);
    const status = useSelector(selectFeedStatus);
    const error = useSelector(selectFeedError);
    const hasMore = useSelector(selectHasMore);

    useEffect(() => {
        dispatch(fetchNextPage());
    }, [dispatch])

    const loadMore = useCallback(() => dispatch(fetchNextPage()), [dispatch]);

    const sentinelRef = useLoadMoreOnScroll(loadMore, hasMore && !error);

    const isInitialLoad = status === "loading" && items.length === 0;

    if(isInitialLoad) return <p>Loading...</p>

    console.log(items);
    console.log(hasMore);
  return (
    <div style={{height: "500px", overflow: "auto"}}>
        <button onClick={() => dispatch(fetchNextPage({refresh: true}))}>Refresh</button>

        <ul>
            {
                items.map((post) => (
                    <li key={post.id}>
                        <strong>{post.id}.</strong> {post.title}
                    </li>
                ))
            }
        </ul>

        {
            error && (
                <p style={{color: "red"}}>
                    {error} <button onClick={() => dispatch(fetchNextPage())}>Retry</button>
                </p>
            )
        }

        {/* {
            hasMore && !error && (
                <button onClick={() => dispatch(fetchNextPage())} disabled={status === "loading"}>
                    {status === "loading" ? "Loading..." : "Load more"}
                </button>
            )
        } */}

        {hasMore && <div ref={sentinelRef} style={{height: 1}} />}

        {!hasMore && <p>You have reached the end.</p>}
    </div>
  )
}

export default Feed;