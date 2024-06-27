'use strict';

function sum(x,y) {
  return x+y;
}

function sum_strings(arr) {
  return arr.reduce((acc, el) => {
    if (el.match(/^\d+/)) {
      return acc + parseInt(el);
    }
    return acc;
  }, 0);
}

function digits(str) {
  return str.split('').reduce((acc, el) => {
    if (el.match(/\d/)) {
      if (parseInt(el) % 2 === 0) {
        acc[1] += parseInt(el);
      } else {
        acc[0] += parseInt(el);
      }
    }
    return acc;
  }, [0, 0]);
}

function letters(str) {
  return str.split('').reduce((acc, el) => {
    if (el.match(/[a-zA-Z]/)) {
      if (el === el.toLowerCase()) {
        acc[0]++;
      } else {
        acc[1]++;
      }
    }
    return acc;
  }, [0, 0]);
}