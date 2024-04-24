"use strict";

import { useEffect, useState } from "react";

const useInfinityScroll = ({ beginPage = 1, cb, bottomEl, config }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(beginPage);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await cb(currentPage);
        setData(res);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        (async () => {
          setLoading(true);
          try {
            setCurrentPage((prev) => prev + 1);
            const res = await cb(currentPage + 1);
            setData((prev) => [...prev, ...res]);
          } catch (err) {
            setError(err);
          }
          setLoading(false);
        })();
      }
    }, config);

    observer.observe(bottomEl.current);
  }, []);

  return { data, error, loading, setData };
};

export default useInfinityScroll;
