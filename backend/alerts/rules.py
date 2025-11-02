from sqlalchemy.orm import Session
from database.models import AlertRule
from typing import List, Dict, Any

def create_alert_rule(db: Session, name: str, rule_type: str, parameters: Dict[str, Any]) -> AlertRule:
    """
    Creates a new alert rule in the database.
    """
    db_rule = AlertRule(name=name, rule_type=rule_type, parameters=parameters)
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)
    return db_rule

def get_alert_rules(db: Session, skip: int = 0, limit: int = 100) -> List[AlertRule]:
    """
    Retrieves all active alert rules.
    """
    return db.query(AlertRule).filter(AlertRule.is_active == True).offset(skip).limit(limit).all()

def get_alert_rule(db: Session, rule_id: int) -> AlertRule:
    """
    Retrieves a single alert rule by its ID.
    """
    return db.query(AlertRule).filter(AlertRule.id == rule_id).first()

def update_alert_rule(db: Session, rule_id: int, name: str, rule_type: str, parameters: Dict[str, Any], is_active: bool) -> AlertRule:
    """
    Updates an existing alert rule.
    """
    db_rule = get_alert_rule(db, rule_id)
    if db_rule:
        db_rule.name = name
        db_rule.rule_type = rule_type
        db_rule.parameters = parameters
        db_rule.is_active = is_active
        db.commit()
        db.refresh(db_rule)
    return db_rule

def delete_alert_rule(db: Session, rule_id: int) -> bool:
    """
    Deletes an alert rule.
    """
    db_rule = get_alert_rule(db, rule_id)
    if db_rule:
        db.delete(db_rule)
        db.commit()
        return True
    return False
