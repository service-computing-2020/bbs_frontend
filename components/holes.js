import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

import HoleCard from './holecard'

export default function Holes (props) {
  const [holes, setHoles] = useState(props.holes)

  return (
    holes.map((val, i) => {
      return <div><HoleCard hole={val} /> </div>
    })
  )
}
