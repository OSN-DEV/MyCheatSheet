import React from 'react';

type BrTextProps = {
  text: string
}
const BrText = (props: BrTextProps) => {
  const newText = props.text.split('\n').map((val, index, array) =>
    index === array.length - 1 
    ? val : 
    <React.Fragment key={index}>{val}<br/></React.Fragment>
  );
  return <>{newText}</>
}

export default BrText;