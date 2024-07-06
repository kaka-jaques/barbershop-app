package br.com.kjf.barbershop.classes;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

public class NetworkUtil {

	private ObjectMapper objMapper = new ObjectMapper();
	
	public ResponseEntity<?> ftpUpload(MultipartFile file, String filename, String oldFilename) throws JsonMappingException, JsonProcessingException {
		
		try {
			
			JSch ssh = new JSch();
			
			Session session = ssh.getSession("${ftp.user}", "${ftp.host}", Integer.parseInt("${ftp.port}"));
			session.setPassword("${password}");
			session.setConfig("StrictHostKeyChecking", "no");
			session.connect();
			
			ChannelSftp sftp = (ChannelSftp) session.openChannel("sftp");
			sftp.connect();
			sftp.rm("${ftp.path}"+oldFilename);
			sftp.put(file.getInputStream(), "${ftp.path}"+filename);
			
			session.disconnect();
			sftp.disconnect();
			
		}catch(JSchException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(objMapper.readTree("{"
					+ "\"error\": \"internal_server_error\","
					+ "\"message\": \"Failed to upload the image to File Server.\","
					+ "\"stacktrace\": \""+e.getMessage()+"\""
					+ "}"));
		} catch (SftpException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(objMapper.readTree("{"
					+ "\"error\": \"internal_server_error\","
					+ "\"message\": \"Failed to upload the image to File Server\","
					+ "\"stacktrace\": \""+e.getMessage()+"\""
					+ "}"));
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(objMapper.readTree("{"
					+ "\"error\": \"internal_server_error\","
					+ "\"message\": \"Failed to upload the image to File Server.\","
					+ "\"stacktrace\": \""+e.getMessage()+"\""
					+ "}"));
		}
		
		return ResponseEntity.ok(objMapper.readTree("{"
				+ "\"status\": \"image_uploaded\","
				+ "\"message\": \"Profile Image successfully uploaded.\""
				+ "}"));
		
	}
	
}
