package com.kinggowarts.common;

import com.kinggowarts.common.utils.EncryptString;
import com.kinggowarts.member.models.Member;
import org.apache.poi.util.StringUtil;
import org.apache.tika.Tika;
import org.apache.tika.detect.Detector;
import org.apache.tika.parser.AutoDetectParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class FileService {
    public static final String[] errorMessage = {
            "wrongType", "error", "nullFile"
    };

    public String writeFile(MultipartFile file, String filenm){
        if (!file.isEmpty()) {
            try {
                byte[] bytes = file.getBytes();
                if(!isValidMimeType(bytes))
                    return "wrongType";
                UUID randomId = UUID.randomUUID();
                String fileName = randomId+"_"+filenm+file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
                HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
                String path = request.getSession().getServletContext().getRealPath("")+"../resources/static/profileimg/";
                System.out.println(path);
                BufferedOutputStream buffStream =
                        new BufferedOutputStream(new FileOutputStream(new File(path+fileName)));
                buffStream.write(bytes);
                buffStream.close();
                System.out.println("You have successfully uploaded " + fileName);
                return fileName;

            } catch (Exception e) {
                System.out.println("You failed to upload " + ": " + e.getMessage());
                return "error";
            }
        } else {
            System.out.println("Unable to upload. File is empty.");
            return "nullFile";
        }
    }

    public void deleteFile(String fileName){
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String path = request.getSession().getServletContext().getRealPath("")+"../resources/static/profileimg/";
            System.out.println(path);
            File file = new File(path + fileName);
            file.delete();

        } catch (Exception e) {
            System.out.println("You failed to upload " + fileName + ": " + e.getMessage());
        }
    }

    private static boolean isValidMimeType(byte[] bytes) {
        // image file, pdf, excel, text, zip 파일에 해당하는 mime type이 아니면 업로드 불가
        Tika tika = new Tika();
        String mimeType;
        try {
            mimeType = tika.detect(bytes);
            if (!isPermittedMimeType(mimeType)) {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
        return true;

    }
    private static boolean isPermittedMimeType(String mimeType) {
        String[] validMimeTypes = {"image" };
        for (String validMimeType : validMimeTypes) {
            if (mimeType.startsWith(validMimeType)) {
                return true;
            }
        }
        return false;
    }

}