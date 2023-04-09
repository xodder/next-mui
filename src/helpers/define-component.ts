import React from 'react';

export type DefinedComponent<P = object> = {
  Component: React.ComponentType<P>;
  props: P;
};

function defineComponent<P extends object>(
  type: React.ComponentType<P> | DefinedComponent<P>,
  props: P
): DefinedComponent<P> {
  if ('Component' in type) {
    return {
      Component: type.Component,
      props: Object.assign({}, type.props, props),
    };
  }

  return {
    Component: type,
    props,
  };
}

export default defineComponent;
