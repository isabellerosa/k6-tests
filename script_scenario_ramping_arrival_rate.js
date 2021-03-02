import { check } from 'k6'
import http from 'k6/http';


export default function () {
    const res = http.get("https://")
    
    check(res, {
      'status 200': (r) => r.status === 200,
    })
}


//https://k6.io/docs/using-k6/scenarios/executors/ramping-arrival-rate
/*
When you want to maintain a constant number of requests without being affected by the 
performance of the system under test.
*/
export let options = {
  scenarios: {
    test: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 1,
      maxVUs: 100,
      stages: [
        { target: 50, duration: '1m' },
        { target: 50, duration: '2m' },
        { target: 200, duration: '1m' },
        { target: 200, duration: '30s' },
        { target: 100, duration: '10s' },
        { target: 100, duration: '1m' },
        { target: 0, duration: '20s' },
      ],
    },
  },
};


/**
 * RUN WITH:
 * 
 * docker run -v "$(pwd)":/test -i loadimpact/k6 run --vus=1 /test/script_read_file.js 
 * docker run -v "$(pwd)":/test -i loadimpact/k6 run -u 0 -s 10s:100 -s 60s:100 -s 10s:0 /test/script_ramping.js > out
 * docker run -v "$(pwd)":/test -i loadimpact/k6 run --out influxdb=http://localhost:8086/myk6db /test/script_ramping.js > out
 * 
 **/ 
