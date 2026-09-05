import React from 'react';
export const Loading = () => <p className="state">Loading…</p>;
export const ErrorMessage = ({ error }) => error ? <p className="error">{error.message}</p> : null;
export const Empty = ({ children = 'No records found.' }) => <p className="state">{children}</p>;
