import Animated, { useAnimatedProps } from "react-native-reanimated";
import { GLSL, Node, Shaders } from "gl-react";
import React, { useEffect, useRef } from "react";

const rect = GLSL`
    #version 300 es
    precision highp float;
    
    in vec2 uv;
    out vec4 color;    
    uniform float ured;     // from js
    uniform float ugreen;   // from js
    uniform float ublue;    // from js
    uniform float opacity;  // from js 
        
    void main() {
      color = vec4(uv.x * ured , uv.y* ugreen, ublue, opacity);
    }`;

const trianle = GLSL`  
  precision highp float;
  varying vec2 uv;
  const float PI = 3.1415926535897932384626433832795;
  uniform float ured;     // from js
  uniform float ugreen;   // from js
  uniform float ublue;    // from js
  uniform float opacity;  // from js
  
  bool equal(float a, float b) {
    return abs(a - b) < 0.001;
  }
  
  float angle(vec2 a, vec2 b) {
    return acos(dot(normalize(a), normalize(b)));
  }
  
  bool insideTriangle(vec2 uv) {
    vec2 a = vec2(0.0, 0.0) - uv;
    vec2 b = vec2(0.5, 1.0) - uv;
    vec2 c = vec2(1.0, 0.0) - uv;    
    return equal(angle(a, b) + angle(b, c) + angle(a, c), PI * 2.0);
  }
  
  void main() {
    float red = uv.y * ured;
    float green = (1.0 - uv.x) * (1.0 - uv.y) * ugreen;
    float blue = uv.x * (1.0 - uv.y) * ublue;    
    gl_FragColor = insideTriangle(uv) ? vec4(red, green, blue, opacity) : vec4(1.0);
  }`;

const shaders = Shaders.create({
  Tri: {
    frag: trianle
  },
  Rect : {
    frag: rect
  }
});

interface HelloBlueProps {
  opacity: number;
  red: number;
  green: number;
  blue : number; // Animated.SharedValue<number>
  type : string
}

const AnimatedNode = Animated.createAnimatedComponent(Node);

const HelloBlue = ({ type = 'TRI', red = 0.1, green = 0.1, blue = 0.1, opacity = 0.1 } : HelloBlueProps) => {
  return (<AnimatedNode
        shader={ (type === 'TRI') ? shaders.Tri : shaders.Rect }
        uniforms={{
          ured : red,
          ugreen : green,
          ublue : blue,
          opacity : opacity
        }}
      />)
}
export default React.memo(HelloBlue);
