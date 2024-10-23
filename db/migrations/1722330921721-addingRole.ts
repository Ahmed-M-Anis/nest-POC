import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingRole1722330921721 implements MigrationInterface {
  name = 'AddingRole1722330921721';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'user'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "passwordChangedAt" SET DEFAULT '"2024-07-30T09:15:22.424Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "passwordChangedAt" SET DEFAULT '2024-07-30 07:39:36.694'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
  }
}
