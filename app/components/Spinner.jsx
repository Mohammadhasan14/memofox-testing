import {Spinner} from '@shopify/polaris';
import React from 'react';

export default function SpinnerExample({spinnerSize='small',}) {
  return <Spinner accessibilityLabel="Spinner example" size={spinnerSize}  />;
}