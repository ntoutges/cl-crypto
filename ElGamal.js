export function generatePrivateKey(p) {
  return 1 + Math.floor(Math.random() * parseInt(p)-1);
}

export function generatePublicKey(p,r,b) {
  return modExp(r,b,p);
}

export function encrypt(p,r,B,m) {
  // const a = BigInt(1 + Math.floor(Math.random() * parseInt(p)-1));
  const a = 223n // for testing
  
  const A = modExp(r,a,p);
  const M = m*modExp(B,a,p) % p;

  return {
    M,A,a
  };
}

export function decrypt(p,b,M,A) {
  return (M * modExp(A, p-1n-b, p)) % p;
}

// thank you github: https://gist.github.com/krzkaczor/0bdba0ee9555659ae5fe
function modExp(a, b, m) {
  a = a % m;
  var result = 1n;
  var x = a;
  while (b > 0) {
      var leastSignificantBit = b % 2n;
      b = b / 2n;
      if (leastSignificantBit == 1n) {
          result = result * x;
          result = result % m;
      }
      x = x * x;
      x = x % m;
  }
  return result;
}
