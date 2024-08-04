package br.com.kjf.barbershop.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "notification_config")
public class NotificationConfigVO {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@OneToOne
	@JoinColumn(name = "user_id")
	private UserVO user;
	private Boolean serviceToday = true;
	private Boolean billExpired = true;
	private Boolean billPending = true;
	private Boolean birthsToday = true;
	private Boolean birthsMonth = true;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public UserVO getUser() {
		return user;
	}
	public void setUser(UserVO user) {
		this.user = user;
	}
	public Boolean getServiceToday() {
		return serviceToday;
	}
	public void setServiceToday(Boolean serviceToday) {
		this.serviceToday = serviceToday;
	}
	public Boolean getBillExpired() {
		return billExpired;
	}
	public void setBillExpired(Boolean billExpired) {
		this.billExpired = billExpired;
	}
	public Boolean getBillPending() {
		return billPending;
	}
	public void setBillPending(Boolean billPending) {
		this.billPending = billPending;
	}
	public Boolean getBirthsToday() {
		return birthsToday;
	}
	public void setBirthsToday(Boolean birthsToday) {
		this.birthsToday = birthsToday;
	}
	public Boolean getBirthsMonth() {
		return birthsMonth;
	}
	public void setBirthsMonth(Boolean birthsMonth) {
		this.birthsMonth = birthsMonth;
	}
	
}
