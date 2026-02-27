"""Initial database schema creation.

Revision ID: 001_initial
Revises: 
Create Date: 2026-02-20

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create enums
    sa.Enum('DRAFT', 'PROCESSING', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', name='workflowstate').create(op.get_bind())
    sa.Enum('MATCHED', 'UNMATCHED_BANK_ONLY', 'UNMATCHED_INTERNAL_ONLY', 'VARIANCE_DETECTED', name='classification').create(op.get_bind())
    sa.Enum('RECONCILIATION_CREATED', 'CSV_UPLOADED', 'RECONCILIATION_STARTED', 'RECONCILIATION_COMPLETED', 'CLASSIFICATION_OVERRIDDEN', 'WORKFLOW_STATE_CHANGED', 'RECORD_APPROVED', 'RECORD_REJECTED', 'AUDIT_LOG_VIEWED', name='auditactiontype').create(op.get_bind())
    sa.Enum('RECONCILIATION', 'TRANSACTION', 'BATCH_UPLOAD', 'WORKFLOW', name='auditentitytype').create(op.get_bind())

    # Users table
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_superuser', sa.Boolean(), nullable=True, default=False),
        sa.Column('full_name', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # Reconciliation sessions table
    op.create_table('reconciliation_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('bank_file_name', sa.String(length=255), nullable=False),
        sa.Column('file_hash', sa.String(length=64), nullable=True),
        sa.Column('total_bank_transactions', sa.Integer(), nullable=True, default=0),
        sa.Column('total_internal_records', sa.Integer(), nullable=True, default=0),
        sa.Column('workflow_state', postgresql.ENUM(name='workflowstate'), nullable=True, default='DRAFT'),
        sa.Column('matched_count', sa.Integer(), nullable=True, default=0),
        sa.Column('unmatched_bank_count', sa.Integer(), nullable=True, default=0),
        sa.Column('unmatched_internal_count', sa.Integer(), nullable=True, default=0),
        sa.Column('variance_count', sa.Integer(), nullable=True, default=0),
        sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_sessions_created_at', 'reconciliation_sessions', ['created_at'], unique=False, postgresql_using='desc')
    op.create_index('ix_sessions_workflow_state', 'reconciliation_sessions', ['workflow_state'], unique=False)

    # Bank transactions table
    op.create_table('bank_transactions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reconciliation_session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('amount', sa.Numeric(precision=15, scale=2), nullable=False),
        sa.Column('reference', sa.String(length=100), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=True),
        sa.Column('transaction_type', sa.String(length=50), nullable=True),
        sa.Column('raw_data', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.ForeignKeyConstraint(['reconciliation_session_id'], ['reconciliation_sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_bank_session', 'bank_transactions', ['reconciliation_session_id'], unique=False)
    op.create_index('ix_bank_amount', 'bank_transactions', ['amount'], unique=False)
    op.create_index('ix_bank_reference', 'bank_transactions', ['reference'], unique=False)
    op.create_index('ix_bank_date', 'bank_transactions', ['date'], unique=False)

    # Internal transactions table
    op.create_table('internal_transactions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('amount', sa.Numeric(precision=15, scale=2), nullable=False),
        sa.Column('reference', sa.String(length=100), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('description', sa.String(length=500), nullable=True),
        sa.Column('account_code', sa.String(length=50), nullable=True),
        sa.Column('cost_center', sa.String(length=50), nullable=True),
        sa.Column('oracle_id', sa.String(length=100), nullable=False),
        sa.Column('fetched_at', sa.Date(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('oracle_id'),
    )
    op.create_index('ix_internal_amount', 'internal_transactions', ['amount'], unique=False)
    op.create_index('ix_internal_reference', 'internal_transactions', ['reference'], unique=False)
    op.create_index('ix_internal_date', 'internal_transactions', ['date'], unique=False)
    op.create_index('ix_internal_oracle_id', 'internal_transactions', ['oracle_id'], unique=False)

    # Reconciliation results table
    op.create_table('reconciliation_results',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reconciliation_session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('bank_transaction_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('internal_transaction_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('classification', postgresql.ENUM(name='classification'), nullable=False),
        sa.Column('variance_amount', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('matched_pair_id', sa.String(length=100), nullable=True),
        sa.ForeignKeyConstraint(['bank_transaction_id'], ['bank_transactions.id'], ),
        sa.ForeignKeyConstraint(['internal_transaction_id'], ['internal_transactions.id'], ),
        sa.ForeignKeyConstraint(['reconciliation_session_id'], ['reconciliation_sessions.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('bank_transaction_id'),
        sa.UniqueConstraint('internal_transaction_id'),
    )
    op.create_index('ix_result_session', 'reconciliation_results', ['reconciliation_session_id'], unique=False)
    op.create_index('ix_result_classification', 'reconciliation_results', ['classification'], unique=False)

    # Workflow states table
    op.create_table('workflow_states',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reconciliation_session_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('state', postgresql.ENUM(name='workflowstate'), nullable=False),
        sa.Column('previous_state', postgresql.ENUM(name='workflowstate'), nullable=True),
        sa.Column('transitioned_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('transitioned_by', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('reason', sa.String(length=1000), nullable=True),
        sa.ForeignKeyConstraint(['reconciliation_session_id'], ['reconciliation_sessions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['transitioned_by'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_workflow_session', 'workflow_states', ['reconciliation_session_id'], unique=False)
    op.create_index('ix_workflow_state', 'workflow_states', ['state'], unique=False)
    op.create_index('ix_workflow_timestamp', 'workflow_states', ['transitioned_at'], unique=False, postgresql_using='desc')

    # Audit logs table
    op.create_table('audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('timestamp', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('action_type', postgresql.ENUM(name='auditactiontype'), nullable=False),
        sa.Column('entity_type', postgresql.ENUM(name='auditentitytype'), nullable=False),
        sa.Column('entity_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_name', sa.String(length=255), nullable=False),
        sa.Column('previous_state', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('new_state', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('details', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('user_agent', sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_audit_timestamp', 'audit_logs', ['timestamp'], unique=False, postgresql_using='desc')
    op.create_index('ix_audit_entity', 'audit_logs', ['entity_type', 'entity_id'], unique=False)
    op.create_index('ix_audit_action', 'audit_logs', ['action_type'], unique=False)
    op.create_index('ix_audit_user', 'audit_logs', ['user_id'], unique=False)

    # Manual overrides table
    op.create_table('manual_overrides',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('reconciliation_result_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('previous_classification', postgresql.ENUM(name='classification'), nullable=False),
        sa.Column('new_classification', postgresql.ENUM(name='classification'), nullable=False),
        sa.Column('reason', sa.String(length=1000), nullable=False),
        sa.Column('overridden_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('overridden_by', postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(['overridden_by'], ['users.id'], ),
        sa.ForeignKeyConstraint(['reconciliation_result_id'], ['reconciliation_results.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_override_result', 'manual_overrides', ['reconciliation_result_id'], unique=False)
    op.create_index('ix_override_timestamp', 'manual_overrides', ['overridden_at'], unique=False, postgresql_using='desc')


def downgrade() -> None:
    op.drop_table('manual_overrides')
    op.drop_table('audit_logs')
    op.drop_table('workflow_states')
    op.drop_table('reconciliation_results')
    op.drop_table('internal_transactions')
    op.drop_table('bank_transactions')
    op.drop_table('reconciliation_sessions')
    op.drop_table('users')

    # Drop enums
    sa.Enum(name='auditentitytype').drop(op.get_bind())
    sa.Enum(name='auditactiontype').drop(op.get_bind())
    sa.Enum(name='classification').drop(op.get_bind())
    sa.Enum(name='workflowstate').drop(op.get_bind())
