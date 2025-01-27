// const { TeamService } = require("../services/team.service");
// const { AppError } = require("../utils/AppError");
// const { Request, Response, NextFunction } = require("express");

// class TeamController {
//   teamService;

//   constructor() {
//     this.teamService = new TeamService();
//   }

//   updateSettings = async (
//     req: Request,
//     res: Response,
//     next: typeof NextFunction
//   ) => {
//     try {
//       const { teamId } = req.params;
//       const settings = req.body;
//       const team = await this.teamService.updateTeamSettings(teamId, settings);
//       return res.status(200).json({ team });
//     } catch (error) {
//       next(error);
//     }
//   };

//   addMembers = async (
//     req: Request,
//     res: Response,
//     next: typeof NextFunction
//   ) => {
//     try {
//       const { teamId } = req.params;
//       const { memberIds } = req.body;
//       const members = await this.teamService.addTeamMembers(teamId, memberIds);
//       return res.status(200).json({ members });
//     } catch (error) {
//       next(error);
//     }
//   };

//   removeMembers = async (
//     req: Request,
//     res: Response,
//     next: typeof NextFunction
//   ) => {
//     try {
//       const { teamId } = req.params;
//       const { memberIds } = req.body;
//       await this.teamService.removeTeamMembers(teamId, memberIds);
//       return res.status(200).json({ message: "Members removed successfully" });
//     } catch (error) {
//       next(error);
//     }
//   };

//   bulkOperations = async (
//     req: Request,
//     res: Response,
//     next: typeof NextFunction
//   ) => {
//     try {
//       const { workspaceId } = req.params;
//       const operations = req.body;
//       const results = await this.teamService.bulkTeamOperations(
//         workspaceId,
//         operations
//       );
//       return res.status(200).json(results);
//     } catch (error) {
//       if (error.details) {
//         return res.status(400).json({
//           message: "Some operations failed",
//           details: error.details,
//         });
//       }
//       next(error);
//     }
//   };

//   moveTeam = async (req: Request, res: Response, next: typeof NextFunction) => {
//     try {
//       const { teamId } = req.params;
//       const { parentId } = req.body;
//       const team = await this.teamService.moveTeam(teamId, parentId);
//       return res.status(200).json({ team });
//     } catch (error) {
//       next(error);
//     }
//   };

//   getHierarchy = async (
//     req: Request,
//     res: Response,
//     next: typeof NextFunction
//   ) => {
//     try {
//       const { teamId } = req.params;
//       const hierarchy = await this.teamService.getTeamHierarchy(teamId);
//       return res.status(200).json({ hierarchy });
//     } catch (error) {
//       next(error);
//     }
//   };

//   createTeam = async (
//     req: Request,
//     res: Response,
//     next: typeof NextFunction
//   ) => {
//     try {
//       const team = await this.teamService.createTeam(req.body);
//       return res.status(201).json({ team });
//     } catch (error) {
//       next(error);
//     }
//   };

//   assignTeamLead = async (
//     req: Request,
//     res: Response,
//     next: typeof NextFunction
//   ) => {
//     try {
//       const lead = await this.teamService.assignTeamLead(req.body);
//       return res.status(201).json({ lead });
//     } catch (error) {
//       next(error);
//     }
//   };

//   updateTeamTitle = async (
//     req: Request,
//     res: Response,
//     next: typeof NextFunction
//   ) => {
//     try {
//       const { teamId } = req.params;
//       const { displayName } = req.body;
//       const team = await this.teamService.updateTeamTitle(teamId, displayName);
//       return res.status(200).json({ team });
//     } catch (error) {
//       next(error);
//     }
//   };
// }

// module.exports = { TeamController };
