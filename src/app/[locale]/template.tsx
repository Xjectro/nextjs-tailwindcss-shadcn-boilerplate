import { Fragment } from 'react';

export default function LocaleTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Fragment>{children}</Fragment>;
}
