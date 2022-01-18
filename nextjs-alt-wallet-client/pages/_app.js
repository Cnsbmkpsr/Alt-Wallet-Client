import 'tailwindcss/tailwind.css'
import "../styles/global.css";
import Router from "next/router";

import ProgressBar from "@badrap/bar-of-progress";
import PropTypes from 'prop-types';

const progress = new ProgressBar({
  size: 4,
  color: "#FE595E",
  className: "z-50",
  delay: 100,
});

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish);
Router.events.on('routeChangeError', progress.finish);

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

MyApp.propTypes = {
  Component: PropTypes.required,
  pageProps: PropTypes.required
}

export default MyApp
