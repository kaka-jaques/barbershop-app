package br.com.kjf.barbershop.classes;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

public class NetworkUtil {

	public void ftpUpload(MultipartFile file, String filename, String oldFilename) {
		
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
			
		} catch (SftpException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
}
