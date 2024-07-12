package br.com.kjf.barbershop.classes;

import java.util.Properties;

import org.springframework.stereotype.Component;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Component
public class MessagingUtil {

	final private String SENDER_EMAIL = "kjfakhouri@gmail.com";
	final private String SENDER_PASSWORD = "";
	
	enum MESSAGE_TEMPLATES {
		
		CREDENTIAL_AUTH("", "IMPERIUM BARBERSHOP - ALTERAÇÃO DE CREDENCIAL"),
		PASSWORD_CHANGE("", "IMPERIUM BARBERSHOP - ALTERAÇÃO DE SENHA"),
		ANUAL_BONUS("", "IMPERIUM BARBERSHOP - PARABÉNS! HOJE É SEU DIA DE SORTE!"),
		PROMO_NOTIFY("", "IMPERIUM BARBERSHOP - PROMOÇÃO NA ÁREA! NÃO PERCA!");
		
		private final String MESSAGE;
		private final String SUBJECT;
		
		private MESSAGE_TEMPLATES(String msg, String subject) {
			this.MESSAGE = msg;
			this.SUBJECT = subject;
		}

		public String getMESSAGE() {
			return MESSAGE;
		}

		public String getSUBJECT() {
			return SUBJECT;
		}
		
	}
	
	public void sendEmail(String receiverEmail, String subject, String content) {
		
		Properties props = new Properties();
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.ssl.enable", "true");
		props.put("mail.smtp.host", "smtp.kinghost.net");
		props.put("mail.smtp.port", "465");
		
		Session session = Session.getInstance(props, new Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(SENDER_EMAIL, SENDER_PASSWORD);
			}
		});
		
		Message msg = new MimeMessage(session);
		try {
			msg.setFrom(new InternetAddress(SENDER_EMAIL));
			msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(receiverEmail));
			msg.setSubject("");
			msg.setText("");
			
			Transport.send(msg);
			
		} catch (AddressException e) {
			e.printStackTrace();
		} catch (MessagingException e) {
			e.printStackTrace();
		}
		
		//TODO - CRIAR RETORNO
		
	}
	
}
