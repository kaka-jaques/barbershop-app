package br.com.kjf.barbershop.vo;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "financeiro")
public class BillVO {

	public enum RecType {

		UNICO("Único", 0), 
		SEMANAL("Semanal", 7), 
		MENSAL("Mensal", 30), 
		BIMESTRAL("Bimestral", 60),
		TRIMESTRAL("Trimestral", 90), 
		SEMESTRAL("Semestral", 180), 
		ANUAL("Anual", 365);

		private final String name;
		private final int days;

		RecType(String name, int days) {
			this.name = name;
			this.days = days;
		}

		@JsonValue
		public String getName() {
			return name;
		}

		public int getDays() {
			return days;
		}

		public static RecType fromJson(String name) {
			for (RecType type : RecType.values()) {
				if (type.name.equalsIgnoreCase(name)) {
					return type;
				}
			}
			throw new IllegalArgumentException("Invalid name: " + name);
		}

	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	@ManyToOne
	@JoinColumn(name = "bill_type_id")
	private BillTypeVO bill_type;
	private String description;
	@Column(nullable = false)
	private Double value;
	@Column(nullable = false)
	private Byte day;
	@Column(nullable = false)
	private Byte month;
	@Column(nullable = false)
	private Integer year;
	@Temporal(TemporalType.DATE)
	private LocalDate last_pay;
	private Boolean paid = false;
	@Enumerated(EnumType.STRING)
	private RecType recurrency;
	
	public BillVO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public BillVO(BillVO bill) {
		super();
		this.id = bill.getId();
		this.bill_type = bill.getBill_type();
		this.description = bill.getDescription();
		this.value = bill.getValue();
		this.day = bill.getDay();
		this.month = bill.getMonth();
		this.year = bill.getYear();
		this.last_pay = bill.getLast_pay();
		this.paid = bill.getPaid();
		this.recurrency = bill.getRecurrency();
	}

	public RecType getRecurrency() {
		return recurrency;
	}

	public void setRecurrency(RecType recurrency) {
		this.recurrency = recurrency;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public Boolean getPaid() {
		return paid;
	}

	public void setPaid(Boolean paid) {
		this.paid = paid;
	}

	public Byte getDay() {
		return day;
	}

	public void setDay(Byte day) {
		this.day = day;
	}

	public Byte getMonth() {
		return month;
	}

	public void setMonth(Byte month) {
		this.month = month;
	}

	public LocalDate getLast_pay() {
		return last_pay;
	}

	public void setLast_pay(LocalDate last_pay) {
		this.last_pay = last_pay;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public BillTypeVO getBill_type() {
		return bill_type;
	}

	public void setBill_type(BillTypeVO bill_type) {
		this.bill_type = bill_type;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Double getValue() {
		return value;
	}

	public void setValue(Double value) {
		this.value = value;
	}

}
