package org.bitcoinj.core;

import org.bitcoinj.crypto.LazyECPoint;

import javax.annotation.Nullable;
import java.math.BigInteger;

/**
 * @author aillusions
 */
public class CustomECKey extends ECKey {

    public CustomECKey(@Nullable BigInteger bigInt) {
        super(bigInt, getLazyECPoint(bigInt));
    }

    private static LazyECPoint getLazyECPoint(BigInteger privKey) {
        return new LazyECPoint(publicPointFromPrivate(privKey));
    }
}
