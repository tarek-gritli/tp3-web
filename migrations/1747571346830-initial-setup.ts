import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1747571346830 implements MigrationInterface {
    name = 'InitialSetup1747571346830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skills" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "designation" character varying NOT NULL, CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cvs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "firstname" character varying NOT NULL, "age" integer NOT NULL, "cin" character varying NOT NULL, "job" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_e7d8a4d55eb4e7a2e43bea8d83a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cv_skill" ("cv_id" integer NOT NULL, "skill_id" integer NOT NULL, CONSTRAINT "PK_9f19a5f3852cb7a605a22dbba4b" PRIMARY KEY ("cv_id", "skill_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fb1264e5491532a54e4dbbd816" ON "cv_skill" ("cv_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_471338f542d48a3c1354c2eaf0" ON "cv_skill" ("skill_id") `);
        await queryRunner.query(`ALTER TABLE "cvs" ADD CONSTRAINT "FK_4fd87fe6ca0c1701dd320bbf643" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cv_skill" ADD CONSTRAINT "FK_fb1264e5491532a54e4dbbd8160" FOREIGN KEY ("cv_id") REFERENCES "cvs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cv_skill" ADD CONSTRAINT "FK_471338f542d48a3c1354c2eaf0d" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cv_skill" DROP CONSTRAINT "FK_471338f542d48a3c1354c2eaf0d"`);
        await queryRunner.query(`ALTER TABLE "cv_skill" DROP CONSTRAINT "FK_fb1264e5491532a54e4dbbd8160"`);
        await queryRunner.query(`ALTER TABLE "cvs" DROP CONSTRAINT "FK_4fd87fe6ca0c1701dd320bbf643"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_471338f542d48a3c1354c2eaf0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb1264e5491532a54e4dbbd816"`);
        await queryRunner.query(`DROP TABLE "cv_skill"`);
        await queryRunner.query(`DROP TABLE "cvs"`);
        await queryRunner.query(`DROP TABLE "skills"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
