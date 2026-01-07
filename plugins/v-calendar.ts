/* eslint-disable @typescript-eslint/no-explicit-any */
import VCalendar from "v-calendar";
// import 'v-calendar/style.css';
import 'v-calendar/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    (nuxtApp.vueApp as any).use(VCalendar, {
      locale: 'ko-KR',
    });
});