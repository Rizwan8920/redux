import { useEffect, useRef } from "react";

function useLoadMoreOnScroll(onLoadMore, enabled){
    const ref = useRef(null);

    useEffect(() => {
        console.log("effect", { enabled, hasEl: !!ref.current })
        if(!enabled || !ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                console.log("observer fired", entry.isIntersecting);
                if(entry.isIntersecting) onLoadMore()
            },
            {rootMargin: "200px"}
        )

        observer.observe(ref.current);

        return () => observer.disconnect();

    }, [onLoadMore, enabled])

    return ref;
}

export default useLoadMoreOnScroll;