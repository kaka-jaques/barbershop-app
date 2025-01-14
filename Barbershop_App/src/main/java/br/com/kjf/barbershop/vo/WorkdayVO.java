package br.com.kjf.barbershop.vo;

import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "workday")
public class WorkdayVO {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@Column(nullable = false)
	private LocalTime openTime;
	private LocalTime startPause;
	private LocalTime endPause;
	@Column(nullable = false)
	private LocalTime closeTime;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public LocalTime getOpenTime() {
		return openTime;
	}
	public void setOpenTime(LocalTime openTime) {
		this.openTime = openTime;
	}
	public LocalTime getStartPause() {
		return startPause;
	}
	public void setStartPause(LocalTime startPause) {
		this.startPause = startPause;
	}
	public LocalTime getEndPause() {
		return endPause;
	}
	public void setEndPause(LocalTime endPause) {
		this.endPause = endPause;
	}
	public LocalTime getCloseTime() {
		return closeTime;
	}
	public void setCloseTime(LocalTime closeTime) {
		this.closeTime = closeTime;
	}
	
}
