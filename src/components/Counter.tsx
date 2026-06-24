"use client";
import dynamic from "next/dynamic";
import "odometer/themes/odometer-theme-default.css";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
const Odometer = dynamic(() => import("react-odometerjs"), {
  ssr: false,
});

interface CounterProps {
  value: number;
  format?: string;
}

const Counter = ({ value, format = "(,ddd).dd" }: CounterProps) => {
  const [odometerValue, setOdometerValue] = useState(0);
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        setOdometerValue(value);
      }, 1000);
    }
  }, [inView, value]);

  return (
    <span ref={ref} className="countdown-font">
      {inView ? <Odometer className="countdown-font" value={odometerValue} format={format} /> : 0}
    </span>
  );
};

export default Counter;
