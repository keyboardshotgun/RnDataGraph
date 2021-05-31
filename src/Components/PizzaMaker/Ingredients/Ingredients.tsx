import React from "react";

import Item from "./Item";

interface BasilProps {
  assets: ReturnType<typeof require>[];
  zIndex: number;
}

const Ingredients = ({ assets, zIndex }: BasilProps) => {
  if (zIndex === 0) {
    return null;
  }
  return (
    <>
      { assets.map((asset, index) => (
        <Item
          zIndex={zIndex}
          total={assets.length}
          key={index}
          asset={asset}
          index={index}
        />
      ))}
    </>
  );
};

export default Ingredients;
