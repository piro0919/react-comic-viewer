import ComicViewer from "index";
import Layout from "components/Layout";
import React, { FC } from "react";

const Pages: FC = () => (
  <Layout>
    <ComicViewer
      pages={[
        "/comics/0.jpg",
        "/comics/1.jpg",
        "/comics/2.jpg",
        "/comics/3.jpg",
        "/comics/4.jpg",
        "/comics/5.jpg",
        "/comics/6.jpg",
      ]}
      switchingRatio={0.75}
    />
    <p>
      hoge
      <br />
      hoge
      <br />
      hoge
      <br />
      hoge
      <br />
      hoge
      <br />
      hoge
      <br />
      hoge
      <br />
      hoge
      <br />
      hoge
    </p>
  </Layout>
);

export default Pages;
