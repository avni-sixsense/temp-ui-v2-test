// Testing of useForm custom Hook

import { renderHook, act } from '@testing-library/react-hooks';
import useForm from 'app/hooks/useForm';

test('should reset counter to updated initial value', () => {
  let initialValue = {
    email: 'newemail@sixsense.ai',
    password: 'hahaha',
    errors: {}
  };
  const { result, rerender } = renderHook(() => useForm(initialValue));

  rerender();
  act(() => {
    result.current.isFormValid();
  });
  expect(result.current.state).toEqual(initialValue);
});
