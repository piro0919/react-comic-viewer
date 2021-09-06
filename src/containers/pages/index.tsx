import ComicViewer from "index";
import Layout from "components/Layout";
import React from "react";

function Pages(): JSX.Element {
  return (
    <Layout>
      <ComicViewer
        initialCurrentPage={2}
        initialIsExpansion={false}
        onChangeCurrentPage={(currentPage) => {
          console.log(currentPage);
        }}
        onChangeExpansion={(isExpansion) => {
          console.log(isExpansion);
        }}
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
        text={{
          expansion: "拡大",
          fullScreen: "全画面",
          move: "移動",
          normal: "通常",
        }}
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
}

export default Pages;
