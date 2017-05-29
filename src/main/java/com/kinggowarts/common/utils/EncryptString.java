package com.kinggowarts.common.utils;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class EncryptString implements InitializingBean{
    @Value("${spring.key}")
    String keyConfig;

    private SecretKeySpec secretKey ;
    private byte[] key ;

    @Override
    public void afterPropertiesSet(){
        setKey(keyConfig);
    }

    private void setKey(String myKey){
        MessageDigest sha = null;
        try {
            key = myKey.getBytes("UTF-8");
            //System.out.println(key.length);
            sha = MessageDigest.getInstance("SHA-1");
            key = sha.digest(key);
            key = Arrays.copyOf(key, 16); // use only first 128 bit
            //System.out.println(key.length);
            System.out.println(new String(key,"UTF-8"));
            secretKey = new SecretKeySpec(key, "AES");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
    public String encrypt(String strToEncrypt)
    {
        try
        {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");

            cipher.init(Cipher.ENCRYPT_MODE, secretKey);


            return Base64.encodeBase64String(cipher.doFinal(strToEncrypt.getBytes("UTF-8")));

        }
        catch (Exception e)
        {
            System.out.println("Error while encrypting: "+e.toString());
        }
        return null;
    }
    public String decrypt(String strToDecrypt)
    {
        try
        {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");

            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            return new String(cipher.doFinal(Base64.decodeBase64(strToDecrypt)));
        }
        catch (Exception e)
        {

            System.out.println("Error while decrypting: "+e.toString());
        }
        return null;
    }
    /*public static void main(String args[])
    {
        final String strToEncrypt = "My text to encrypt";
        final String strPssword = "encryptor key";
        EncryptString.setKey(strPssword);

        EncryptString.encrypt(strToEncrypt.trim());

        System.out.println("String to Encrypt: " + strToEncrypt);
        System.out.println("Encrypted: " + AES.getEncryptedString());

        final String strToDecrypt =  AES.getEncryptedString();
        AES.decrypt(strToDecrypt.trim());

        System.out.println("String To Decrypt : " + strToDecrypt);
        System.out.println("Decrypted : " + AES.getDecryptedString());

    }*/
}
