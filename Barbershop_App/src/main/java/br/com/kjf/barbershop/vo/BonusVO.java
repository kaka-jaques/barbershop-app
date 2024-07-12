package br.com.kjf.barbershop.vo;

import java.util.GregorianCalendar;

import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "bonus")
public class BonusVO {

	public enum BonusType{
		
		BIRTH("Aniversário"),
		LOYALTY("Fidelidade"),
		SERVICE_TIME("Tempo de Serviço"),
		GRATIFICATION("Gratificação"),
		PROMOTION("Promoção"),
		CHRISTMAS("Natal"),
		OTHER_FESTIVAL("Outro Festival"),
		OTHER_REASON("Outro Motivo");
		
		private final String motivo;
		
		BonusType(String motivo){
			this.motivo = motivo;
		}
		
		@JsonValue
		public String getMotivo() {
			return motivo;
		}
		
		public static BonusType fromJson(String motivo) {
			for(BonusType bonus : BonusType.values()) {
				if(bonus.motivo.equalsIgnoreCase(motivo)) {
					return bonus;
				}
			}
			throw new IllegalArgumentException("Invalid reason: "+motivo);
		}
		
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private GregorianCalendar expire_date;
	@Enumerated(EnumType.STRING)
	private BonusType bonus_type;
	private String other_reason;
	@ManyToOne
	@JoinColumn(name = "client_id")
	private ClientVO client;
	
	public ClientVO getClient() {
		return client;
	}
	public void setClient(ClientVO client) {
		this.client = client;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public GregorianCalendar getExpire_date() {
		return expire_date;
	}
	public void setExpire_date(GregorianCalendar expire_date) {
		this.expire_date = expire_date;
	}
	public BonusType getBonus_type() {
		return bonus_type;
	}
	public void setBonus_type(BonusType bonus_type) {
		this.bonus_type = bonus_type;
	}
	public String getOther_reason() {
		return other_reason;
	}
	public void setOther_reason(String other_reason) {
		this.other_reason = other_reason;
	}	
	
}
