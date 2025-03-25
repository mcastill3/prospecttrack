export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
    [key: string]: string[];
  };
  
  export const routeAccessMap: RouteAccessMap = {
    "/admin(.*)": ["admin"],
    "/analista_marketing(.*)": ["analista_marketing"],
    "/marketing(.*)": ["marketing"],
    "/comercial(.*)": ["comercial"],
    "/director_comercial(.*)": ["director_comercial"],
    "/digital_sales(.*)": ["digital_sales"],
    "/list/team": ["admin", "analista_marketing", "comercial"],
    "/list/activities": ["admin", "marketing", "comercial", "analista"],
    "/list/events": ["admin", "marketing", "comercial", "analista"],
    "/list/announcements": ["admin", "marketing", "comercial", "analista", "director_comercial", "director_marketing"],
    "/list/campaign": ["admin", "analista_marketing", "comercial", "director_comercial", "director_marketing",  "digital_sales"],
    "/list/organizations": ["admin", "analista_marketing", "digital_sales", "director_comercial", "director_marketing"],
    "/list/partner": ["admin", "analista_marketing", "digital_sales", "director_comercial", "director_marketing"],
    "/list/contact": ["admin", "analista_marketing", "digital_sales", "director_comercial", "director_marketing"],
    "/list/player": ["admin", "analista_marketing", "digital_sales", "director_comercial", "director_marketing"],
    "/list/ciclos": ["admin", "marketing", "comercial", "analista", "director_comercial", "director_marketing"],
    "/list/flujos": ["admin", "director_marketing"],
    "/list/tasks": ["admin", "analista_marketing", "digital_sales"],
    "/list/strategies": ["admin", "analista_marketing"],
    "/list/lead": ["admin", "analista_marketing", "digital_sales", "director_comercial", "director_marketing"],

  };